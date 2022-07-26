import { GL } from './gl/GL';
import { WebGLRenderer } from './WebGLRenderer';

export class RenderBuffer
{
    get OFFSCREEN_WIDTH()
    {
        return this._OFFSCREEN_WIDTH;
    }
    set OFFSCREEN_WIDTH(v)
    {
        this._OFFSCREEN_WIDTH = v;
        this.invalidate();
    }
    private _OFFSCREEN_WIDTH = 1024;

    get OFFSCREEN_HEIGHT()
    {
        return this._OFFSCREEN_HEIGHT;
    }
    set OFFSCREEN_HEIGHT(v)
    {
        this._OFFSCREEN_HEIGHT = v;
        this.invalidate();
    }
    private _OFFSCREEN_HEIGHT = 1024;

    /**
     * 是否失效
     */
    private _invalid = true;

    /**
     * 使失效
     */
    protected invalidate()
    {
        this._invalid = true;
    }

    /**
     * 激活
     * @param gl
     */
    static active(gl: GL, renderBuffer: RenderBuffer)
    {
        if (renderBuffer._invalid)
        {
            this.clear(renderBuffer);
            renderBuffer._invalid = false;
        }

        let buffer = gl.cache.renderBuffers.get(renderBuffer);
        if (!buffer)
        {
            // Create a renderbuffer object and Set its size and parameters
            buffer = gl.createRenderbuffer(); // Create a renderbuffer object
            if (!buffer)
            {
                console.warn('Failed to create renderbuffer object');

                return;
            }
            gl.cache.renderBuffers.set(renderBuffer, buffer);
            gl.bindRenderbuffer(gl.RENDERBUFFER, buffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, renderBuffer.OFFSCREEN_WIDTH, renderBuffer.OFFSCREEN_HEIGHT);
        }

        return buffer;
    }

    /**
     * 清理纹理
     */
    static clear(renderBuffer: RenderBuffer)
    {
        WebGLRenderer.glList.forEach((gl) =>
        {
            const buffer = gl.cache.renderBuffers.get(renderBuffer);
            if (buffer)
            {
                gl.deleteRenderbuffer(buffer);
                gl.cache.renderBuffers.delete(renderBuffer);
            }
        });
    }
}
